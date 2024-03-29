import "./Advantages.css"

const Advantages = () => {
  return (
    <section id="ventajas" className="ventajas">
    <div className="titulo">
      <h2 data-aos="fade-up">
        ¿Sabía las ventajas de contar con un
        <strong data-aos="fade-up"> sitio web bien diseñado?</strong>
      </h2>
      <p data-aos="fade-up">
        Nosotros nos encargamos de que su negocio gane prestigio digital para
        que pueda incrementar sus ventas
      </p>
    </div>

    <div className="contenedor-ventajas">
      <div className="ventaja" data-aos="fade-up">
        <div className="icono">
          <span className="material-icons-outlined"> stacked_line_chart </span>
        </div>

        <div className="texto">
          <p>
            Los negocios que no cuentan con un sitio web de su propia marca,
            venden un 30% menos que los negocios que si cuentan con un sitio
            como tal
          </p>
        </div>
      </div>

      <div className="ventaja" data-aos="fade-up">
        <div className="icono">
          <span className="material-icons-outlined"> data_exploration </span>
        </div>

        <div className="texto">
          <p>Gane prestigio y posicionamiento en el amplio mundo digital</p>
        </div>
      </div>

      <div className="ventaja" data-aos="fade-up">
        <div className="icono">
          <span className="material-icons-outlined"> corporate_fare </span>
        </div>

        <div className="texto">
          <p>Facilita la parte organizacional y técnica de su negocio</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Advantages
