import React from "react";

const Alert = (props) => <li className="alert">{props.headline}</li>;

export const CurrentWeather = (props) => (
  <div>
    <h3>
      {props.city}, {props.state}
    </h3>
    <h4>Currently:</h4>
    <img src={props.weatherIcon} alt="Weather Icon" />
    <div className="temp">{Math.floor(props.temp)}&deg;F</div>
    <h4>Feels Like: {Math.floor(props.feels)}&deg;F</h4>
    <h4>UV Index: {Math.floor(props.uv)}</h4>
    <h4>Cloud Cover: {props.clouds}%</h4>
    <h4>Conditions: {props.conditions}</h4>
    <h4 className="alerts">Alerts:</h4>
    {props.alerts.length ? (
      <ul>
        {props.alerts.map((element) => (
          <Alert headline={element.title} key={element.title} />
        ))}
      </ul>
    ) : (
      <div className="no-alerts">(No Alerts)</div>
    )}
  </div>
);
