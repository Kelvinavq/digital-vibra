import GroupIcon from '@mui/icons-material/Group';
import PercentIcon from '@mui/icons-material/Percent';
import StarRateIcon from '@mui/icons-material/StarRate';
import Diversity3Icon from '@mui/icons-material/Diversity3';

const Items_list = () => {
  return (
    <div className="items_list">
      <ul>
        <li>
            <div className="icono"><GroupIcon/></div>
            <div className="text">
                <span>Prospectos registrados</span>
                <p>128</p>
            </div>
        </li>
        <li>
            <div className="icono"><PercentIcon/></div>
            <div className="text">
                <span>Comisión de Marzo</span>
                <p>$ 2,640.00</p>
            </div>
        </li>
        <li>
            <div className="icono"><StarRateIcon/></div>
            <div className="text">
                <span>Posición Actual</span>
                <p>Posición Nº 1</p>
            </div>
        </li>
        <li>
            <div className="icono"><Diversity3Icon/></div>
            <div className="text">
                <span>Equipo Perteneciente</span>
                <p>Equipo A</p>
            </div>
        </li>
      </ul>
    </div>
  )
}

export default Items_list
