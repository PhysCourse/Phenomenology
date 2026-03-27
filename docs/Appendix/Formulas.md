# Формулы

## Интегралы в размерной регуляризации

- Мера объема в \(d\) измерениях:

\[
    \frac{d^d k}{(2\pi)^d} = \frac{2}{(4\pi)^{d/2} \Gamma(d/2)} k^{d-1} dk
     \label{eq:measure_d_dimensional}
\]

### Общий интеграл

\[
    I(a,b) = \int{\frac{d^d k}{(2\pi)^d} \frac{k^{2a}}{(k^2 - \Delta^2 + i\epsilon)^b}} 
    \label{eq:general_integral}
\]

\[
    I(a,b) = \frac{i(-1)^{a-b}}{(4\pi)^{d/2}} 
    \frac{\Gamma(a + \frac{d}{2}) \Gamma(b - a - \frac{d}{2})}{\Gamma(\frac{d}{2}) \Gamma(b)} \left(\Delta^2 - i\epsilon\right)^{a + \frac{d}{2} -b}
    \label{eq:general_integral_gamma}
\]

\[
    I(a,b) = \frac{i}{(4\pi)^{d/2}} 
    \frac{(a+\frac{d}{2}-1)!/(a+\frac{d}{2}-b)!}{\Gamma(\frac{d}{2}) \Gamma(b)} \left(\Delta^2 - i\epsilon\right)^{a + \frac{d}{2} -b} \frac{\pi}{\sin{\pi(-\frac{d}{2})}}
    \label{eq:general_integral_gamma_sin}
\]

### Частные случаи:

- \(d = 4-2\epsilon\)

\[
    I(a,b) = \frac{i}{(4\pi)^{2-\epsilon}}  \frac{(a+\frac{d}{2}-1)!\,/\, (a+\frac{d}{2}-b)!}{\Gamma(\frac{d}{2}) \Gamma(b)}  
    \left(\Delta^2 - i\epsilon\right)^{a + 2-\epsilon -b} \frac{\pi}{\sin{\pi\epsilon}}
    \label{eq:general_integral_4d}
\]

- \(a = 0\)

\[
    I(0,b) = \frac{i}{(4\pi)^{2-\epsilon}} \frac{(\frac{d}{2}-1)!\,/\, (\frac{d}{2}-b)!}{\Gamma(\frac{d}{2}) \Gamma(b)}
    \left(\Delta^2 - i\epsilon\right)^{2-\epsilon -b}  \frac{\pi}{\sin{\pi\epsilon}}
    \label{eq:general_integral_a0}
\]

- \(a = 0, b = 1\)

\[
    I(0,1) = \frac{i}{(4\pi)^{2-\epsilon}} \frac{1}{\Gamma(\frac{d}{2})}  \left(\Delta^2 - i\epsilon\right)^{1-\epsilon} \frac{\pi}{\sin{\pi\epsilon}}
    \label{eq:general_integral_a0b1}
\]

\[
    I(0,1) \approx \frac{i}{ (4\pi)^{2}} \frac{\Delta^2}{\Gamma(2-\epsilon)}  \left(  \frac{1}{\epsilon} - \ln{4\pi} - \ln{\left(\Delta^2 - i\epsilon\right)} + O(\epsilon) \right)
    \label{eq:general_integral_a0b1_approx}
\]

- \(a = 0, b = 2\)

\[
    I(0,2) = \frac{i}{(4\pi)^{2-\epsilon}} \frac{1}{\Gamma(1-\epsilon)}  \left(\Delta^2 - i\epsilon\right)^{-\epsilon} \frac{\pi}{\sin{\pi\epsilon}}
    \label{eq:general_integral_a0b2}
\]


\[
    I(0,2) \approx \frac{i}{ (4\pi)^{2}} \frac{1}{\Gamma(1-\epsilon)}  \left(  \frac{1}{\epsilon} - \ln{4\pi} - \ln{\left(\Delta^2 - i\epsilon\right)} + O(\epsilon) \right)
    \label{eq:general_integral_a0b2_approx}
\]

- \(a = 1, b = 1\)

\[
    I(1,1) = \frac{i}{(4\pi)^{2-\epsilon}} \frac{1}{\Gamma(2-\epsilon)}  \left(\Delta^2 - i\epsilon\right)^{2-\epsilon} \frac{\pi}{\sin{\pi\epsilon}}
    \label{eq:general_integral_a1b1}
\]

\[
    I(1,1) \approx \frac{i}{ (4\pi)^{2}} \frac{\Delta^4}{\Gamma(2-\epsilon)}  \left(  \frac{1}{\epsilon} - \ln{4\pi} - \ln{\left(\Delta^2 - i\epsilon\right)} + O(\epsilon) \right)
    \label{eq:general_integral_a1b1_approx}
\]

- \(a = 1, b = 2\)

\[
    I(1,2) = \frac{i}{(4\pi)^{2-\epsilon}} \frac{2-\epsilon}{\Gamma(2-\epsilon)}  \left(\Delta^2 - i\epsilon\right)^{1-\epsilon} \frac{\pi}{\sin{\pi\epsilon}}
    \label{eq:general_integral_a1b2}
\]

\[
    I(1,2) \approx \frac{i}{ (4\pi)^{2}} \cdot 2 \frac{\Delta^2 (1-\frac{\epsilon}{2})}{\Gamma(2-\epsilon)}  \left(  \frac{1}{\epsilon} - \ln{4\pi} - \ln{\left(\Delta^2 - i\epsilon\right)} + O(\epsilon) \right)
    \label{eq:general_integral_a1b2_approx}
\]

### Евклидов пропагатор в $d$ измерениях

\[
    \begin{aligned}
    G(x) &= \int { \frac{d^d q}{(2\pi)^d} \frac{e^{iq x}}{ (q^2+m^2)^n} } \\
    G(y = m|x|) &=  \frac{m^{d-2n}}{\Gamma(n)} \frac{1}{(4\pi)^{d/2}} \left(\frac{y}{2}\right)^{n-\frac{d}{2}} 2K_{n-\frac{d}{2}}(y)
    \end{aligned}
    \label{eq:propagator_position_space}
\]

??? info "Подробности"

    $K_{\nu}(y)$ — модифицированная функция Бесселя второго рода 
    [(1)](https://mathworld.wolfram.com/ModifiedBesselFunctionoftheSecondKind.html),
    [(2)](https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D0%B4%D0%B8%D1%84%D0%B8%D1%86%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8_%D0%91%D0%B5%D1%81%D1%81%D0%B5%D0%BB%D1%8F).

    Можно определить её через функцию первого рода $I_{\nu}(y)$:
    
    \[
        K_{\nu}(y) = \frac{\pi}{2} \frac{I_{-\nu}(y) - I_{\nu}(y)}{\sin{\pi\nu}}   
    \]

    \[
        I_{\nu}(y) = \left(\frac{y}{2}\right)^{\nu} \sum_{k=0}^{\infty} \frac{(y^2/4)^k}{k! \Gamma(\nu + k + 1)} 
    \]


??? success "Вывод"

    
    
    Преобразуем к безразмерному виду, сделав замену $q = m\cdot u$, $y = m\cdot x$

    \[
        G(x) = m^{d-2n} \int{\frac{d^d u}{(2\pi)^d} \frac{e^{iu y}}{ (u^2+1)^n} }
    \]

    Используем $\alpha$ представление Швингера

    \[
        \frac{1}{(u^2+1)^n} = \int{ dz e^{-z (u^2+1)} \frac{z^{n-1}}{\Gamma(n)} }
    \]

    \[
        G(x) = \frac{m^{d-2n}}{\Gamma(n)} \int_0^\infty{ dz z^{n-1} e^{-z} \int{\frac{d^d u}{(2\pi)^d} e^{-z (u^2+1) + i u y}} } 
    \]

    Интегрируя по $u$ мы получаем

    \[
        G(x) = \frac{m^{d-2n}}{\Gamma(n)} \frac{1}{(4\pi)^{d/2}}\int_0^\infty{ dz z^{n-1 - \frac{d}{2}} e^{-z - \frac{y^2}{4z}} }
    \]

    Далее, интегрируя по $z$ мы получаем:

    \[
        G(x) = \frac{m^{d-2n}}{\Gamma(n)} \frac{2^{\frac{d}{2}-n+1}}{(4\pi)^{d/2}} y^{n-\frac{d}{2}} K_{n-\frac{d}{2}}(y)
    \]

## Сечения и вероятности распада

- Нормировка состояний:

\[
    \langle p' | p \rangle = 2E (2\pi)^3 \delta^3(\vec{p} - \vec{p}')
    \label{eq:state_normalization}
\]

- Дифференциальное сечение для процесса \(1 + 2 \to f\) полная формула:

\[
    d\sigma = \frac{1}{4\sqrt{(p_1 p_2)^2 - m_1^2 m_2^2}} |\mathcal{M}|^2 (2\pi)^4 \delta^4(p_1 + p_2 - \sum_f p_f) \prod_f \frac{d^3 p_f}{(2\pi)^3 2E_f}
    \label{eq:differential_cross_section}
\]

где \(\vec{v}_i = \frac{\vec{p}_i}{E_i}\) — скорость частицы \(i\), а \(\lambda\) — функция Каулера:

\[
    \begin{aligned}
    \lambda(s,m_1^2,m_2^2) &= (s - (m_1 + m_2)^2)(s - (m_1 - m_2)^2) \\
    |\vec{p}_{1CM}| &= \frac{\sqrt{\lambda(s, m_1^2, m_2^2)}}{2\sqrt{s}} \\
    |\vec{p}_{3CM}| &= \frac{\sqrt{\lambda(s, m_3^2, m_4^2)}}{2\sqrt{s}} 
    \end{aligned}
    \label{eq:kallen_function}
\]

\[
    \begin{aligned}
    \sqrt{(p_1 p_2)^2 - m_1^2 m_2^2} = E_1 E_2 |\vec{v}_1 - \vec{v}_2| = |\vec{p}_{CM}| \sqrt{s} = \\
    = m_2 |\vec{p}_{1,lab}| = \sqrt{\lambda(s, m_1^2, m_2^2)}/(2\sqrt{s})    
    \end{aligned}
\]

- Сечение для процесса \(1 + 2 \to 3 + 4\):

\[
    \frac{d\sigma}{d\Omega} = \frac{1}{64\pi^2 s} \frac{|\vec{p}_{3CM}|}{|\vec{p}_{1CM}|} |\mathcal{M}|^2
    \label{eq:cross_section_2to2}
\]

\[
    \frac{d\sigma}{dt} = \frac{1}{64\pi s |\vec{p}_{1CM}|^2} |\mathcal{M}|^2
    \label{eq:cross_section_2to2_dt}
\]

- Вероятность распада частицы \(A\) в \(n\) частиц:

\[
    d\Gamma = \frac{1}{2M} |\mathcal{M}|^2 (2\pi)^4 \delta^4(p_A - \sum_f p_f) \prod_f \frac{d^3 p_f}{(2\pi)^3 2E_f}
    \label{eq:decay_width_full}
\]

- Распад частицы \(A\) в 2 частицы:

\[
    \frac{d\Gamma}{d\Omega} = \frac{1}{32\pi^2} \frac{|\vec{p}_1|}{M^2} |\mathcal{M}|^2 \quad \text{где} \quad |\vec{p}_1| = \frac{\sqrt{\lambda(M^2, m_1^2, m_2^2)}}{2M}
    \label{eq:decay_width_2body}
\]

## Тождества с гамма матрицами

### Гамма матрицы в обкладках

\[
    \gamma^\mu \gamma_\mu = d
    \label{eq:gamma_contraction_0}
\]

\[
    \gamma^\mu \gamma^\nu \gamma_\mu = (2-d) \gamma^\nu 
    \label{eq:gamma_contraction_1}
\]

\[
    \gamma^\mu \gamma^\nu \gamma^\rho \gamma_\mu = 4 g^{\nu\rho} - (4-d) \gamma^\nu \gamma^\rho
    \label{eq:gamma_contraction_2}
\]

\[
    \gamma^{\mu}\gamma^a \gamma^b \gamma^c \gamma_\mu = (4-d) \gamma^a \gamma^b \gamma^c - 2  \gamma^c \gamma^b \gamma^a
    \label{eq:gamma_contraction_2_0}
\]

\[
    \gamma^{\mu}\gamma^a \gamma^b \gamma^c \gamma_\mu = (6-d) \gamma^a \gamma^b \gamma^c + 4 g^{ac}\gamma^b - 4 g^{ab} \gamma^c - 4 g^{bc} \gamma^a
    \label{eq:gamma_contraction_2}
\]