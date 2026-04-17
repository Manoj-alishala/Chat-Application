import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { API_BASE_URL } from "./utils/apiConfig.js";

// Global fetch wrapper to ensure cookies (JWT) are sent with cross-origin requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
	let [resource, config] = args;
	
	const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
	const isApiCall = urlStr.includes('/api/') || (API_BASE_URL && urlStr.startsWith(API_BASE_URL));
	const token = localStorage.getItem("chat-token");

	if (isApiCall) {
		if (!config) config = {};
		config.credentials = "include";
		config.headers = new Headers(config.headers || {});
		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
		}
	}
	
	return originalFetch(resource, config);
};

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthContextProvider>
				<SocketContextProvider>
					<App />
				</SocketContextProvider>
			</AuthContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
