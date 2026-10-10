import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-zinc-600">The page hit an unexpected error. Your data is safe.</p>
        <button className="mt-4 border border-black bg-black px-4 py-2 text-sm text-white" onClick={() => { this.setState({ err: null }); location.assign("/"); }}>Back to home</button>
      </div>
    );
  }
}
