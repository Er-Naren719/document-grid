import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

async function deferRender(params) {
	const { worker } = await import("./mocks/browser");
	return worker.start();
}

deferRender().then(() => {
	const root = ReactDOM.createRoot(document.getElementById("root"));
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});

