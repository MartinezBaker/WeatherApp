import React from "react";
import { CurrentWeather } from "../../components/CurrentWeather";
import axios from "axios";

class LocalWeather extends React.Component {
  state = {
    weatherData: "",
    isLoading: false,
    hasError: false,
    errMess: ""
  };

  getWeather = async (lat, lon) => {
    try {
      this.setState({ isLoading: true });
      const { data } = await axios(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=1dee2138ce9f4c0a86c98a8baadaf01b&include=minutely,alerts&units=I`
      );
      const iconCode = data.data[0].weather.icon;
      const weatherIcon = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;
      this.setState({
        ...this.state,
        weatherData: data,
        weatherIcon: weatherIcon,
        isLoading: false
      });
    } catch (error) {
      this.setState({
        hasError: true,
        isLoading: false,
        errMess: "Weather Data Not Available :("
      });
      setTimeout(() => {
        this.setState({ hasError: false, errMess: "" });
      }, 3000);
    }
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) =>
        this.getWeather(position.coords.latitude, position.coords.longitude)
      );
    } else {
      this.setState({
        hasError: true,
        errMess: "Could Not Get Current Location :("
      });
      setTimeout(() => {
        this.setState({ hasError: false, errMess: "" });
      }, 3000);
    }
  }
  render() {
    const { temp, city_name, state_code, app_temp, weather, uv, clouds } =
      this.state.weatherData && this.state.weatherData.data[0];

    return (
      <div>
        {this.state.isLoading && <div>Loading...</div>}
        {this.state.hasError && (
          <div className="errmess">
            <strong>{this.state.errMess}</strong>
          </div>
        )}
        {this.state.weatherData && (
          <CurrentWeather
            weatherIcon={this.state.weatherIcon}
            temp={temp}
            city={city_name}
            state={state_code}
            conditions={weather.description}
            feels={app_temp}
            alerts={this.state.weatherData.alerts}
            uv={uv}
            clouds={clouds}
          />
        )}
      </div>
    );
  }
}

export default LocalWeather;
