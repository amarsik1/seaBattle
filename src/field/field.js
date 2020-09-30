import React from 'react';

class Field extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {name} = this.props;

        let css = {opacity: .6 };

        let field = this.props.field.map((arr, index) => {
            let row = arr.map((item, index) => {
                let className = "cell";
                if (this.props.gameStarted === true)
                    className += " cell_game";
                className += ' cell_' + item[1];
                return <td key={index}
                           className={className}
                           onClick={item[1] === 'none' && this.props.gameStarted && name !== 'user' && this.props.move === 'user' ? this.props.click.bind(this, {
                               player: this.props.name,
                               coordinates: item[0]
                           }) : null}>
                    <span className="z"/>
                </td>;
            });
            return <tr key={index}>{row}</tr>;
        });

        return <div className="field" style={this.props.move === name || !this.props.gameStarted ? css : null}>
            <h3>{name} field</h3>
            <table border="1px">
                <tbody className={name}>
                {field}
                </tbody>
            </table>
        </div>;
    }
}

export default Field;
