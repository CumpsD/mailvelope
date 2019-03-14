/**
 * Copyright (C) 2017 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class PlainText extends React.PureComponent {
  constructor(props) {
    super(props);
    this.sandbox = null;
    this.textarea = null;
  }

  componentDidMount() {
    $(window).on('resize', () => {
      this.resize();
    });
  }

  resize() {
    $(this.sandbox).height(0);
    $(this.sandbox).height($(this.sandbox).parents('.editor-body').height());
  }

  componentDidUpdate(prevProps) {
    this.resize();
    // if default value is set after rendering, set manually
    if (this.textarea && prevProps.defaultValue !== this.props.defaultValue) {
      this.textarea.value = this.props.defaultValue;
      this.textarea.selectionStart = 0;
      this.textarea.selectionEnd = 0;
    }
  }

  getValue() {
    return this.textarea.value;
  }

  createPlainText() {
    const textarea = (
      <textarea defaultValue={this.props.defaultValue} className="form-control" rows={12} autoFocus
        onChange={event => this.props.onChange(event.target.value)}
        onBlur={this.props.onBlur}
        onMouseUp={this.props.onMouseUp}
        ref={node => this.textarea = node}
        style={{width: '100%', height: '100%', marginBottom: 0, color: 'black', resize: 'none'}}
      />
    );
    ReactDOM.render(textarea, $(this.sandbox).contents().find('#root').get(0));
    this.props.onLoad && this.props.onLoad();
  }

  render() {
    const sandboxContent = `
      <!DOCTYPE html>
      <html style="height: 100%">
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="../../main.css">
        </head>
        <body style="overflow: hidden; margin: 0; height: 100%">
         <div id="root" style="height: 100%">
         </div>
        </body>
      </html>
    `;
    return (
      <iframe sandbox="allow-same-origin allow-scripts" srcDoc={sandboxContent} frameBorder={0} style={{display: 'block', overflowY: 'hidden'}}
        ref={node => this.sandbox = node} onLoad={() => this.createPlainText()} />
    );
  }
}

PlainText.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onMouseUp: PropTypes.func,
  onLoad: PropTypes.func
};
