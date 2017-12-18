import React from 'react'
const hljs = window.hljs

export default class CodeBlock extends React.PureComponent {
  static defaultProps = {
    language: ''
  }

  setRef = el => {
    this.codeEl = el
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl)
  }

  render() {
    const { value } = this.props
    return (
      <pre>
        <code ref={this.setRef}>{value}</code>
      </pre>
    )
  }
}
