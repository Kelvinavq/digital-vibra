import "./Cards.css";

const Cards = () => {
  return (
    <div className="container_home">
      <section className="cards">
        <div className="Card animate__animated animate__backInUp">
          <div className="icono">
            <i className="fa-solid fa-ranking-star"></i>
          </div>

          <div className="texto">
            <span>SEO</span>
            <p>Todos nuestros servicios incluyen optimización SEO</p>
          </div>
        </div>

        <div className="Card animate__animated animate__backInUp">
          <div className="icono">
            <i className="fa-solid fa-globe"></i>
          </div>

          <div className="texto">
            <span>Posicionamiento</span>
            <p>Aparece en los primeros resultados de búsqueda</p>
          </div>
        </div>

        <div className="Card animate__animated animate__backInUp">
          <div className="icono">
            <i className="fa-solid fa-code"></i>
          </div>

          <div className="texto">
            <span>Optimización</span>
            <p>Su sitio web optimizado y con código limpio</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cards;
