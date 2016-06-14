var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
    render:function(){
        return (
            <h1>欢迎光临珠峰培训</h1>
        )
    }
});

var app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<App/>,app);