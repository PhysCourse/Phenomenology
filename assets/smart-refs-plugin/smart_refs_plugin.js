function resolvePageUrl(siteUrl, relativePath) {
  const base = siteUrl + (siteUrl.endsWith("/") ? "" : "/");
  return new URL(relativePath, base).href;
}
function normalizeUrl(url) {
  if (!url) return url;

  // уже абсолютный с протоколом
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
    return url;
  }

  // начинается с //
  if (url.startsWith("//")) {
    return "http:" + url;
  }

  // localhost:8000, example.com, etc
  return "http://" + url.replace(/^\/+/, "");
}

class SmartRefsGraph{
	constructor(graph_array){
		this.graph = graph_array; // [{"path":"...","R0":[]},{...} ]
    this.page_map = new Map();
    for(const [index,node] of this.graph.entries()){
      this.page_map.set(node.path,index);
    }
	}
  get_dependent_elements(selected_nodes_ids,ref_types,max_deepness){
    const auto_toggled_nodes = new Set(
      Array.from(selected_nodes_ids).map(nodeId=>this.page_map.get(nodeId))
    );
    const visited = new Set();

    const queue = []; // [ { nodeId, depth } ]

    for(const nodeId of selected_nodes_ids){
      queue.push({ nodeIndex: this.page_map.get(nodeId), depth: 0 });
      visited.add(nodeId);
    }
    while(queue.length > 0){
      const { nodeIndex, depth } = queue.shift();
      if(nodeIndex === undefined) continue;
      const node = this.graph[nodeIndex];
      const t =  !!ref_types[1] ? 1 : ref_types[0] ? 0 : null;
      if(t === null) continue; // no types selected

      const ref_type_key = "R"+t;
      const refs = node[ref_type_key] || [];
      for(const dest of refs){
        if(!visited.has(dest)){
          visited.add(dest);
          auto_toggled_nodes.add(dest);
          if(max_deepness === null || depth + 1 < max_deepness){
            queue.push({ nodeIndex: dest, depth: depth + 1 });
          }
        }
      }

    }
    const sorted_list = Array.from(auto_toggled_nodes).sort((a,b)=>a-b);
    return {indicies:sorted_list,set:new Set(Array.from(auto_toggled_nodes).map(nid=>this.graph[nid].path))};
  }
};

class SettingBox{
  /*
  checkboxes for types,
  checkbox+scroll for max deepness of ref propagation (if it None - unlimited)
  */
  constructor(type_labels,html_element,init_state=null){
    this.type_labels = type_labels;
    this.deepscroll_label = "Max Deepness";
    this.types_pushed = init_state ? init_state.types_pushed : Array(type_labels.length).fill(true);
    this.max_deepness = init_state ? init_state.max_deepness : null; // unlimited

    this.html_element = html_element;

    this._draw_html();
    this.onchange = function(){};
  }
  set_params(types_pushed,max_deepness){
    for(let t of types_pushed){
      this.types_pushed[t] = true;
    }
    if(max_deepness !== null 
      || (typeof max_deepness !== "number" || max_deepness < 1)){
      console.log("Invalid max_deepness value");
    } else{
      this.max_deepness = max_deepness;
    }
  }
  set_callback(callback_on_change){
    this.onchange = callback_on_change;
  }

  toggle_type(type_index){
    this.types_pushed[type_index] = !this.types_pushed[type_index];
    this.onchange();
  }
  set_max_deepness(new_value){
    this.max_deepness = new_value;
    this.onchange();
  }
  _draw_html(){
    this.html_element.innerHTML = "";

    for (let t = 0; t < this.type_labels.length; t++) {
      const label = document.createElement("label");
      label.className = "smart-refs-type-filter";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      cb.addEventListener("change", () => {
        this.toggle_type(t);
      });

      label.append(cb, this.type_labels[t]);
      this.html_element.appendChild(label);
    }
    const deepness_label = document.createElement("label");
    deepness_label.className = "smart-refs-deepness-label";
    deepness_label.textContent = this.deepscroll_label;
	
    const deepness_input = document.createElement("input");
    deepness_input.type = "number";
    deepness_input.min = "1";
    deepness_input.placeholder = "unlimited";

    deepness_input.addEventListener("change", () => {
      const val = parseInt(deepness_input.value);
      if (isNaN(val) || val < 1) {
        this.set_max_deepness(null);
      } else {
        this.set_max_deepness(val);
      }
    });
	// correct: deepness_label should be right after deepness_input
    //deepness_label.appendChild(deepness_input); // this makes it left

    this.html_element.appendChild(deepness_input);
	this.html_element.appendChild(deepness_label);
  }
};

class SmartRefsToc{
  constructor(
    content,html_element,
    content_filter = "",
    /*For future to make subcontnt from full content*/
    init_state = null
  ){
    this.content= content;
    this.html_element = html_element;
    this.toggled_nodes = init_state ? new Set(init_state.toggled_nodes) : new Set();
    this.toggle_callback = function(){};
    this.element_map = new Map(); // path -> html element
    this._draw_html();
    
  }

  set_state(toggled_nodes){
    if(toggled_nodes === null){
      return;
    }
    this.toggled_nodes = new Set(toggled_nodes);
  }
  onToggle(nodeId){
    if(this.toggled_nodes.has(nodeId)){
      this.toggled_nodes.delete(nodeId);
    }else{
      this.toggled_nodes.add(nodeId);
    }
    this.toggle_callback();
  }

  static update_group_state(group_element){ /*return true if any item is active*/
    var hasActive = false;
    for (const subgroup of group_element.children) {
      if (subgroup.classList.contains("smart-refs-toc-group")) {
        hasActive = SmartRefsToc.update_group_state(subgroup) || hasActive;
      }
      if (subgroup.classList.contains("smart-refs-toc-item")) {
        if (
          subgroup.classList.contains("active-manual") ||
          Array.from(subgroup.classList).some(cls => cls.startsWith("active-type-")) ||
          subgroup.classList.contains("inactive-forced")
        ) {
          hasActive = true;
        }
      }
    }
    group_element.classList.toggle("active", hasActive);
    return hasActive;
  }
  update(auto_toggled_nodes){
    auto_toggled_nodes = new Set(auto_toggled_nodes);
    // reset others, set auto toggled and forced toggled
    for(const [nodeId,el] of this.element_map.entries()){
      if(this.toggled_nodes.has(nodeId)){
        const cb = el.querySelector("input");
        cb.checked = true;
        el.classList.add("active-manual");
        el.classList.remove("active-type-0");
        el.classList.remove("inactive-forced");
        continue;
      }
      else if(auto_toggled_nodes.has(nodeId)){
        const cb = el.querySelector("input");
        cb.checked = true;
        el.classList.add("active-type-0");
        el.classList.remove("active-manual");
        el.classList.remove("inactive-forced");
        continue;    
      }
      const cb = el.querySelector("input");
      cb.checked = false;
      el.className = "smart-refs-toc-item"; // reset classes
    }
    // update groups
    SmartRefsToc.update_group_state(this.html_element);
    
  }

  _draw_html(){
    this.html_element.innerHTML = "";
    const site = this.content;
    const renderGroup = (items,level, parentEl,group_name) => {
      const group = document.createElement("fieldset");
      group.className = `smart-refs-toc-group smart-refs-toc-group-${Math.min(level, 6)}`;

      parentEl.appendChild(group);

      const title = document.createElement("legend");
      title.className = "smart-refs-toc-group-title";
      title.textContent = group_name;
      group.appendChild(title);

      for (const item of items) {
        if (item.items && item.items.length) {
          // вложенная группа
          renderGroup(item.items, level + 1, group,item.title || "Group");
        } else {
          const nodeId = "this/" + item.path;
          const row = document.createElement("div");
          row.className = "smart-refs-toc-item";
          row.dataset.nodeId = nodeId;

          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.addEventListener("change", () => this.onToggle(nodeId));

          const link = document.createElement("a");
          link.textContent = item.title || nodeId;
		  // document.baseURI is uri for page, need uri for root
          link.href = resolvePageUrl(window.location.origin, item.path);
          link.target = "_self";

          row.append(cb, link);
          group.appendChild(row);

          this.element_map.set(nodeId, row);
        }
      }
    }

    renderGroup(site.items,  0, this.html_element,site.title || "Contents");
  }

};


class SvgArrows{
  constructor(wrapper){
    this.wrapper = wrapper
    const style = this.wrapper.style;
    if (getComputedStyle(this.wrapper).position === "static") {
      style.position = "relative";
    }
    const SVG_NS = "http://www.w3.org/2000/svg";
    this.svg_element = document.createElementNS(SVG_NS,"svg");
    this.svg_element.setAttribute("id", "smart-refs-table-arrows");
    Object.assign(this.svg_element.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    });
    
    const defs = document.createElementNS(SVG_NS, "defs");
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "smart-refs-table-arrowhead");

    this.arrow_size = 8
    this.arrow_width = 2

    marker.setAttribute("markerWidth", "8");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    const polygon = document.createElementNS(SVG_NS, "polygon");
    polygon.setAttribute("points", "0 0, 8 3, 0 6");
    polygon.setAttribute("fill", "currentColor");
    polygon.setAttribute("fill-opacity", "0.2");

    marker.appendChild(polygon);
    defs.appendChild(marker);
    this.svg_element.appendChild(defs);
    this.wrapper.appendChild(this.svg_element);

    this.arrows = [];
    window.addEventListener("resize", () => this.on_resize());
	this.wrapper.addEventListener("scroll", ()=>this.on_resize());
  }

  static getCenter(el, wrapper) {
    const elRect = el.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const scrollX = wrapper.scrollLeft || 0;
    const scrollY = wrapper.scrollTop || 0;
    return {
      x: elRect.left - wrapperRect.left + scrollX + elRect.width / 2,
      y: elRect.top  - wrapperRect.top  + scrollY + elRect.height / 2
    };
  }
  static getLineParams(x0,y0,x1,y1,width,arrow_size){
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);

    const ux = dx / len;
    const uy = dy / len;

    const offset = arrow_size*width;
    return [{
      x:x0,
      y:y0
      },{
      x:Math.max(0,x1 - ux*offset),
      y:Math.max(0,y1 - uy*offset)
    }]
  }
  drawArrow(from, to) {

    const svg = this.svg_element;
    const wrapper = this.wrapper;

    if (!from || !to) return;

    const p1 = SvgArrows.getCenter(from, wrapper);
    const p2 = SvgArrows.getCenter(to, wrapper);
    const [p1c,p2c] = SvgArrows.getLineParams(p1.x,p1.y,p2.x,p2.y,this.arrow_width,this.arrow_size);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    line.setAttribute('x1', p1c.x);
    line.setAttribute('y1', p1c.y);
    line.setAttribute('x2', p2c.x);
    line.setAttribute('y2', p2c.y);
    line.setAttribute('stroke', "currentColor");
    line.setAttribute('stroke-opacity', '0.2');
    line.setAttribute('stroke-width', `${this.arrow_width}`);
    line.setAttribute('marker-end', 'url(#smart-refs-table-arrowhead)');

    svg.appendChild(line);
    this.arrows.push({line:line,from:from,to:to})
  }
  updateArrow(line, fromEl, toEl) {
    const p1 = SvgArrows.getCenter(fromEl, this.wrapper);
    const p2 = SvgArrows.getCenter(toEl, this.wrapper);

    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
  }
  on_resize(){
    this.arrows.forEach(({line,from,to}) => {
      this.updateArrow(line,from,to);
    });
  }
  clear(){
    this.arrows.forEach(({line,_from,_to}) => {
      line.remove();
    });
    this.arrows.length = 0;
  }
  render(lines){
    this.clear();
    for(const [from_el,to_el] of lines){
      this.drawArrow(from_el,to_el)
    }
  }
};
class SmartRefTable{
  //TODO
  constructor(full_conent,html_element){
    this.content = full_conent.content;
    this.graph = full_conent.graph;
    
    this.column_names = this.content.map(x=>x.title);
    this.table_matrix = null;
    this.html_element = html_element;
    this.arrows = new SvgArrows(html_element)
    this.table_element = document.createElement("table")
    html_element.appendChild(this.table_element)

	this.table_element.addEventListener("scroll", ()=> this.arrows.on_resize());
  }

  update(ordered_page_list,ref_types){ /* like [0,1,2,5..] */
    this.table_matrix = this.content.map(x=>[]);
    const rt = ref_types[1] ? 1 : ref_types[0] ? 0 : null;
    if(rt == null){
      return;
    }
    let last_cols = this.column_names.map(x=>0);

    const arrows = [];
    for (let page_index of ordered_page_list){
      let page_info = this.graph[page_index];
      if(!page_info){
        continue;
      }
      try{
        const page_name = page_info.path.slice(page_info.path.indexOf('/') + 1);
        const page_path = page_info.item_path.split(".").map(x=>Number(x))

        let content_page_info = this.content;
        try{
          for(let index of page_path.slice(0,-1)){
            content_page_info = content_page_info[index].items;
          }
          content_page_info = content_page_info[page_path[page_path.length-1]];
        } catch(e){
          console.log("can't get page " + e);
        }

        let page_title = "page";
        try{
          page_title = content_page_info.title;
        } catch(e){
          console.log("can't get page " + e);
        }

        const TC_graph = page_info["TC" + rt]
        const TR_graph = page_info["TR" + rt]

        let col_index = page_path[0];
        let min_index =  last_cols[col_index];

        for(let col =0;col<last_cols.length;++col){
          if(col === col_index){
            continue;
          }
          let max_col_index = null;
          for(let row = last_cols[col];row>0 && max_col_index ===null ;--row){
            if(!!this.table_matrix[col][row]){
              const tmp_page_index = this.table_matrix[col][row].index
              if(TC_graph.includes(tmp_page_index)){
                max_col_index = row;
              }
            }
          }
          if(max_col_index !=null){
            min_index = Math.max(max_col_index+1,min_index);
          }
        }
        last_cols[col_index] = min_index+1;
        this.table_matrix[col_index][min_index] = 
          {index:page_index,page:page_name,title:page_title,
            page_path:page_path,rows:1,html_element:null};

        // go through table to put arrows
        for(let i = 0;i<this.table_matrix.length;++i ){
          const tmp_column = this.table_matrix[i];
          for(let j = 0;j<tmp_column.length;++j ){
            if(i == col_index && (!!tmp_column[j+1] || !!tmp_column[min_index-1])){
              continue;
            }
            if(!tmp_column[j]){
              continue;
            }
            if(TR_graph.includes(tmp_column[j].index) ){
              arrows.push({from:{i:col_index,j:min_index},to:{i:i,j:j}});
            }
          }
        }
      } catch (e){
        console.log(e);
      }
    } // end of dependent page loop
    this.render_table(arrows);
  }
  render_table(arrows){
    this.table_element.innerHTML = "";
    // go through whople table and connect rows
    // 
    /* need for future
    for(let i=0;i<this.table_matrix.length;++i){
      col = this.table_matrix[i];
      let last_j = null;
      for(let j=0;j<col.length;++j){
        if(!col[j]){
          continue;
        }
        if(!!last_j){
          if(col[last_j].page_path[1] === col[j].page_path[1]){
            col[last_j].rows += j - last_j;
            col[j].rows = 0;
          }
        }
      }
    }
    */
    const col_count = this.table_matrix.length;
    const row_count = Math.max(0,
      ...this.table_matrix.map(col => col.length)
    );

    const thead = document.createElement("thead");
    const head_tr = document.createElement("tr");
    thead.appendChild(head_tr);
    for(let i=0;i<this.table_matrix.length;++i){
      const th = document.createElement("th");
      th.textContent = this.content[i].title || `Column ${i}`;
      th.className = "smart-refs-table-header";
      head_tr.appendChild(th);
    }

    this.table_element.appendChild(thead);

    const tbody = document.createElement("tbody");
    this.table_element.appendChild(tbody);
    
    for (let row = 0; row < row_count; row++) {
      const tr = document.createElement("tr");
      tbody.appendChild(tr);
      for (let col = 0; col < col_count; col++) {
        const page_info = this.table_matrix[col][row];
        const td = document.createElement("td");
        tr.appendChild(td);
        if (!page_info) {
          td.className = "smart-refs-table-empty";
          continue;
        }
        const  cell_text = page_info.title;
        const content_info = this.content[page_info.page_path[0]];
        const site_url = content_info.alias == "this" ? window.location.origin :
          new URL(normalizeUrl(this.content[page_info.page_path[0]].url)).origin;
        //return ref with cell_text and site_url
        const a = document.createElement("a");
        a.textContent = page_info.title;
        try{
            a.href = new URL(
            page_info.page,
            site_url
          ).href;
        } catch(e){
          console.log(e);
        }
        
        a.target = "_self";
        a.className = "smart-refs-table-link";
        td.appendChild(a);
        td.className = "smart-refs-table-cell";
        page_info.html_element = td;
      }
    }
    const arrow_pairs = [];
    for (const { from, to } of arrows) {
      const from_el = this.table_matrix[from.i]?.[from.j]?.html_element;
      const to_el   = this.table_matrix[to.i]?.[to.j]?.html_element;
      if (from_el && to_el) {
        arrow_pairs.push([from_el, to_el]);
      }
    }
    this.arrows.render(arrow_pairs);
  }

};

class SmartRefApp{
  constructor(smartRefGraph,settingBox,smartRefsToc,smartRefTable=null){
    this.graph = smartRefGraph;
    this.settingBox = settingBox;
    this.smartRefsToc = smartRefsToc;
    this.smartRefTable = smartRefTable;

    this.settingBox.set_callback(()=>{ this.update(); });
    this.smartRefsToc.toggle_callback = ()=>{ this.update(); };
    

    try{
      this.parseStateFromQuery();
    } catch(e){
      console.error("Error parsing state from query:", e);
    }
    
    this.update();
    
  }
  
  update(){
    this.encodeStateToQuery();
    const forced_toggled = this.smartRefsToc.toggled_nodes;
    const {indicies:toggled_list,set:auto_toggled} = this.graph.get_dependent_elements(
      forced_toggled,
      this.settingBox.types_pushed,
      this.settingBox.max_deepness
    );
    this.smartRefsToc.update(auto_toggled);
    if(this.smartRefTable){
      this.smartRefTable.update(toggled_list,this.settingBox.types_pushed);
    }
  }
  encodeStateToQuery(){
    
    const enabledTypes = new Array();
    for (let i = 0; i < this.settingBox.types_pushed.length; i++) {
      if (this.settingBox.types_pushed[i]) {
        enabledTypes.push(i);
      }
    }
    const maxDeepness = this.settingBox.max_deepness;
    const pushed = Array.from(this.smartRefsToc.toggled_nodes).join(",");
    let url = new URL(window.location);
    url.search = new URLSearchParams({
      pushed: pushed,
      types: enabledTypes, 
      max_deepness: maxDeepness
    });
    history.replaceState(null, "", url.toString());
  }
  parseStateFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const pushedParam = urlParams.get("pushed");

    const typesParam = urlParams.get("types");

    const maxDeepnessParam = urlParams.get("max_deepness");
    const pushed = pushedParam ? pushedParam.split(",") : [];
    const types = typesParam ? typesParam.split(",").map((t) => parseInt(t)) : []; 
    const maxDeepness = maxDeepnessParam ? parseInt(maxDeepnessParam) : null;
    
    
    this.settingBox.set_params(typesParam, maxDeepness);
    this.smartRefsToc.set_state(pushed);
  }
};



/*************************************************
 * TOC RENDERING
 *************************************************/

function init() {
  console.log("smart-refs: init");
  // find element smart-refs-toc in document
  const toc_container = document.getElementById("smart-refs-toc");
  if (!toc_container) return;
  // create setting contatiner above toc
  const setting_container = document.createElement("div");
  setting_container.id = "smart-refs-settings";
  toc_container.parentNode.insertBefore(
    setting_container,
    toc_container
  );
  // find element smart-ref-table in document for future use
  const table_container = document.getElementById("smart-refs-table");
  console.log("Found content, load refs");
  
  toc_container.setAttribute("initialized","true");

  fetch("/assets/smart-refs-plugin/smart-refs.json")
    .then(response => response.json())
    .then(data => {
      // create graph
      const smartRefsGraph = new SmartRefsGraph(data.graph);
      // create setting box
      const type_labels = new Array(Math.min(Math.max.apply(Math, data.types),10)+1);
      for(let i=0; i< data.types.length; i++){
        if(i==0)
          type_labels[i] = "require"
        else if(i==1)
          type_labels[i] = "proof"
        else
          type_labels[i] = String(i);
      }
      const settingBox = new SettingBox(type_labels, setting_container);
      let self_content = null;
      for(site_data of data.content){
        if(site_data.alias == "this"){
          self_content = site_data;
          break;
        }
      }
      // create toc
      const smartRefsToc = new SmartRefsToc(self_content, toc_container);
	  const smartRefable = !table_container ? null : 
        new SmartRefTable(data,table_container);
      // set callbacks
      const app = new SmartRefApp(smartRefsGraph, settingBox, smartRefsToc, smartRefable);
    }).catch(error => {
      console.error("Error loading index.json:", error);
    });


}
function ensureSmartRefs() {
  const m_toc = document.getElementById("smart-refs-toc"); 
  if (!m_toc) {
    return; // уже инициализировано
  }
  if(m_toc.getAttribute("initialized") == "true"){
	return;
  }
  init();
}
document.addEventListener("DOMContentLoaded", ensureSmartRefs);
window.addEventListener("hashchange", ensureSmartRefs);
window.addEventListener("popstate", ensureSmartRefs);