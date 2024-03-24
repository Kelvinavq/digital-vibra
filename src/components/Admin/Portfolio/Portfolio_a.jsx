import "./Portfolio.css"
import Config from "../../../config/Config";

const Portfolio_a = () => {
  // Example proyectos data
  const proyectos = [
    {
      id: 1,
      name: "Proyecto 1",
      link: "https://proyecto1.com",
      description: "Descripción del Proyecto 1",
      image_portrait: Config.imgPortfolio +"portfolio1.jpeg",
      image_landscape: Config.imgPortfolio +"portfolio1_.jpg",
    },
    {
      id: 2,
      name: "Proyecto 2",
      link: "https://proyecto2.com",
      description: "Descripción del Proyecto 2",
      image_portrait: Config.imgPortfolio +"portfolio2.jpeg",
      image_landscape: Config.imgPortfolio +"portfolio2_.png",
    },
    // Add more proyectos as needed
  ];

  return (
    <div className="details portfolio">
      <div className="recentOrders">
        <div className="cardHeader">
          <h2>Portafolios recientes</h2>
        </div>

        {proyectos.length > 0 ? (
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Link</th>
                <th scope="col">Descripción</th>
                <th scope="col">Imagen vertical</th>
                <th scope="col">Imagen horizontal</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr
                  key={proyecto.id}
                  className="li-portfolio"
                  onClick={() =>
                    (window.location = `proyecto.php?id=${proyecto.id}`)
                  }
                >
                  <td data-label="Nombre">{proyecto.name}</td>
                  <td data-label="Link">{proyecto.link}</td>
                  <td data-label="Descripción">{proyecto.description}</td>
                  <td data-label="Imagen vertical">
                    <img
                      src={`${proyecto.image_portrait}`}
                      alt=""
                    />
                  </td>
                  <td data-label="Imagen horizontal">
                    <img
                      src={`${proyecto.image_landscape}`}
                      alt=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p>Aún no hay proyectos</p>
        )}
      </div>
    </div>
  );
};

export default Portfolio_a;
