import React from "react";
import { CurrentWeather } from "../../components/CurrentWeather";
import axios from "axios";

class City extends React.Component {
  state = {
    weatherData: "",
    weatherIcon: "",
    isLoading: false,
    hasError: false,
    errMess: ""
  };
  getCity = async (city) => {
    try {
      this.setState({ isLoading: true });
      const { data } = await axios(
        `https://api.geoapify.com/v1/geocode/search?city=${city}&format=json&apiKey=876063dbf9c4454f93fc86aa3c52a823`
      );
      this.getWeather(data.results[0].lat, data.results[0].lon);
      this.setState({ city: "" });
    } catch (error) {
      this.setState({
        isLoading: false,
        hasError: true,
        errMess: "Problem Loading City Data :("
      });
      setTimeout(() => {
        this.setState({ hasError: false, errMess: "" });
      }, 3000);
    }
  };
  getWeather = async (lat, lon) => {
    try {
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
      console.log(this.state.weatherData);
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
    const city = this.props.match.params.cityId;
    this.getCity(city);
  }

  componentDidUpdate(prevProps, prevState) {
    const city = this.props.match.params.cityId;
    if (prevProps.match.params.cityId !== city) {
      console.log(city);
      this.getCity(city);
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

export default City;
