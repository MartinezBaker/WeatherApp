import React from "react";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import LocalWeather from "./pages/LocalWeather";
import City from "./pages/City";
import SearchInput from "./components/SearchInput";
import { LocalHeader } from "./components/LocalHeader";
import axios from "axios";
import "./styles.css";

const cities = [];

export default class App extends React.Component {
  state = {
    cities,
    city: "",
    redirectToCity: false,
    hasError: false,
    errMess: ""
  };
  getCity = async (city) => {
    try {
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      const cityCapitalized = capitalizeFirstLetter(city);
      const cityExist = this.state.cities.find(
        (element) => element === cityCapitalized
      );
      if (!cityExist) {
        const { data } = await axios(
          `https://api.geoapify.com/v1/geocode/search?city=${city}&format=json&apiKey=876063dbf9c4454f93fc86aa3c52a823`
        );
        const newCities = [...this.state.cities, cityCapitalized];
        if (data.results.length) {
          this.setState({
            ...this.state,
            cities: newCities,
            city: city
          });
        } else {
          this.setState({
            hasError: true,
            errMess: "No Data For Your Submission :("
          });
          setTimeout(() => {
            this.setState({ hasError: false, errMess: "" });
          }, 3000);
        }
      } else {
        this.setState({
          hasError: true,
          errMess: "This City Already Exists In History"
        });
        setTimeout(() => {
          this.setState({ hasError: false, errMess: "" });
        }, 3000);
      }
    } catch (error) {
      console.log("Error");
    }
  };
  handleSubmit = (value) => {
    this.getCity(value);
  };

  render() {
    const historyEmpty =
      this.state.cities.length < 1 ? (
        <div className="history-empty">(History Empty)</div>
      ) : (
        ""
      );
    return (
      <Router>
        <LocalHeader />
        <div className="container">
          <nav>
            <ul>
              <li>
                <Link className="link" to="/">
                  Local Weather
                </Link>
              </li>
              <h3>Search History</h3>
              {historyEmpty}
              {this.state.cities.map((city) => (
                <li>
                  <Link className="link" to={`/city/${city}`} key={city}>
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="current-weather">
            <SearchInput handleSubmit={this.handleSubmit} />
            {this.state.hasError && (
              <div className="errmess">
                <strong>{this.state.errMess}</strong>
              </div>
            )}
            <Switch>
              <Route exact path="/" component={LocalWeather} />
              <Route exact path="/city/:cityId" component={City} />
            </Switch>
          </div>
          {this.state.city && <Redirect to={`/city/${this.state.city}`} />}
        </div>
      </Router>
    );
  }
}
