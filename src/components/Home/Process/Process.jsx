import "./Process.css";

const Process = () => {
  return (
    <section id="procesos" className="procesos">
      <div className="titulo">
        <h2 data-aos="fade-up">
          Nuestro <strong>Proceso</strong>
        </h2>
        <p></p>
      </div>

      <div className="contenedor-proceso">
        <div className="proceso" data-aos="fade-up">
          <p className="numero">01</p>

          <div className="contenido">
            <i className="fa-regular fa-eye"></i>
            <span>Descubrimiento</span>
            <p>
              Años de desarrollo para excelentes resultados en nuestro proceso
            </p>
          </div>
        </div>

        <div className="proceso" data-aos="fade-up">
          <p className="numero">02</p>

          <div className="contenido">
            <i className="fa-regular fa-pen-to-square"></i>
            <span>Fase de Diseño</span>
            <p>
              Implementamos la estrategia realizando un prototipo de diseño de
              alta calidad
            </p>
          </div>
        </div>

        <div className="proceso" data-aos="fade-up">
          <p className="numero">03</p>

          <div className="contenido">
            <i className="fa-solid fa-layer-group"></i>
            <span>Fase de Desarrollo</span>
            <p>
              Podrá ver como construimos su sitio web optimizado para convertir
              clientes
            </p>
          </div>
        </div>

        <div className="proceso" data-aos="fade-up">
          <p className="numero">04</p>

          <div className="contenido">
            <i className="fa-solid fa-rocket"></i>
            <span>Lanzamiento</span>
            <p>
              Su herramienta de generación de clientes 24/7 comienza a funcionar
            </p>
          </div>
        </div>
      </div>

      <div className="texto">
        <p data-aos="fade-up">
          Si quiere descubrir cómo puede diferenciarse del resto, construyendo
          un sitio web de alta performance, que genere clientes 24/7, contáctese
          con nosotros para empezar
        </p>
      </div>

      <button
        data-aos="fade-up"
        className="btn"
       
      >
        ¡Quiero Presupuestos!
      </button>
    </section>
  );
};

export default Process;
