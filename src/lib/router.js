// Simple hash-based router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');

    // Parse query parameters
    const params = {};
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }

    // Find matching route
    let handler = this.routes[path];
    let routeParams = {};

    if (!handler) {
      // Try to match dynamic routes like /members/:id
      for (const route in this.routes) {
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length === pathParts.length) {
          let match = true;
          routeParts.forEach((part, i) => {
            if (part.startsWith(':')) {
              routeParams[part.slice(1)] = pathParts[i];
            } else if (part !== pathParts[i]) {
              match = false;
            }
          });

          if (match) {
            handler = this.routes[route];
            break;
          }
        }
      }
    }

    if (handler) {
      this.currentRoute = path;
      handler({ path, params: { ...routeParams, ...params } });
    } else {
      // 404 - redirect to home
      this.navigate('/');
    }
  }
}

export const router = new Router();
