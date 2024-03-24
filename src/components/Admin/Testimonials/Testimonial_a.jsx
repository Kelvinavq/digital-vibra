import "./Testimonial.css";

const Testimonial_a = () => {
  // Example testimonios data
  const testimonios = [
    {
      id: 1,
      name: "Usuario 1",
      testimonial: "Este es el primer testimonio.",
      estatus: "aprobado",
    },
    {
      id: 2,
      name: "Usuario 2",
      testimonial: "Este es el segundo testimonio.",
      estatus: "pendiente",
    },
  ];

  return (
    <div className="details">
      <div className="recentOrders">
        <div className="cardHeader">
          <h2>Testimonios Recientes</h2>
          <a href="testimonios.php" className="btn">
            Ver todos
          </a>
        </div>

        {testimonios.length > 0 ? (
          <div className="tabla">
            <table>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Testimonio</th>
                  <th scope="col">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {testimonios.map((testimonio) => (
                  <tr
                    key={testimonio.id}
                    className="li-testimonio"
                    data-id={testimonio.id}
                  >
                    <td data-label="Nombre">{testimonio.name}</td>
                    <td data-label="Testimonio">{testimonio.testimonial}</td>
                    <td data-label="Estatus">
                      <span className={`status ${testimonio.estatus}`}>
                        {testimonio.estatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aún no hay testimonios</p>
        )}
      </div>
    </div>
  );
};

export default Testimonial_a;
