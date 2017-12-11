import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import logo from '../../Assets/logo.svg'
import code from '../../Assets/code.svg'
import github from '../../Assets/github.svg'
import './style.css'

export default class Header extends PureComponent {
  static propTypes = {}

  render() {
    return (
      <nav className="Header row between middle">
        <div className="Header-left row middle">
          <img src={logo} className="Header-logo" alt="logo" />
          <h1>Speechless</h1>
          <div>Demo</div>
          <div>Install</div>
          <div>Why?</div>
          <div>
            <a href="https://puemos.github.io/speechless">Docs</a>
          </div>
        </div>
    
        <div className="Header-right row middle around">
          <div>
            <a href="https://github.com/puemos/speechless/tree/master/demo">
              <img src={code} className="Header-code-logo" alt="code" />
            </a>
          </div>

          <div>
            <a href="https://github.com/puemos/speechless">
              <img src={github} className="Header-github-logo" alt="github" />
            </a>
          </div>
        </div>
      </nav>
    )
  }
}
