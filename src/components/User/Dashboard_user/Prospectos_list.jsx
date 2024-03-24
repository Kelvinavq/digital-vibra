import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Prospectos_list = () => {
  return (
    <div className="prospectos_list">
      <div className="title">
        <h2>Prospectos Registrados</h2>
        <button>
          <MoreHorizIcon />
        </button>
      </div>

      <div className="tabla_prospectos">
        <table>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Prospecto</th>
              <th scope="col">¿Respondió?</th>
              <th scope="col">¿Agendó?</th>
            </tr>
            </thead>

            <tbody>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              <tr>
                <td data-label="Nº">152</td>
                <td data-label="Prospecto">Nombre Apellido</td>
                <td data-label="¿Respondió?" className="si">
                  <span>Si</span>
                </td>
                <td data-label="¿Agendó?" className="no">
                  <span>no</span>
                </td>
              </tr>
              
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prospectos_list;
