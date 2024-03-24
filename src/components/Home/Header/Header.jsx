import imgHeader from "../../../assets/images/Header.svg"
import "./Header.css"

const Header = () => {
  return (
    <header id="inicio">
    <div className="left">
      <div className="textos">
        <h1 className="animate__animated animate__backInLeft">
          En <strong>Vibra Digital</strong>
        </h1>
        <h2 className="animate__animated animate__backInUp">
          Construimos sitios web que trabajan por usted
        </h2>
        <div className="separador animate__animated animate__fadeInLeft"></div>
        <p className="animate__animated animate__lightSpeedInRight">
          Los negocios que cuentan con una página web cómoda de usar para el
          cliente, con un mensaje claro, incrementan sus ventas mas de un 25%.
        </p>
      </div>
      <div className="circle dos"></div>
    </div>

    <div className="right">
      <div className="img">
        <img src={imgHeader} alt="diseño web vibra digital" />
      </div>
    </div>
  </header>
  )
}

export default Header
