import { Route, Switch, Router, Link, useLocation } from 'wouter';
import { KoalaProvider } from './context/KoalaContext';
import Home from './pages/Home';
import KinshipCalculator from './pages/Kinship';

const NotFound = () => <div className="p-4 text-center mt-10 text-gray-400">404 Not Found</div>;

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="pt-6 px-5 relative z-50">
      <div className="flex bg-white/70 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/">
          <a className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all ${location === '/' ? 'bg-koala-base text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
            家系図
          </a>
        </Link>
        <Link href="/calculator">
          <a className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all ${location === '/calculator' ? 'bg-koala-base text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
            親戚度
          </a>
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <KoalaProvider>
      <Router base="/koala-memo-family-tree">
        <div className="min-h-screen bg-koala-light text-koala-text font-sans selection:bg-koala-base/30">
          <div className="max-w-md mx-auto min-h-screen relative shadow-sm flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/calculator" component={KinshipCalculator} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    </KoalaProvider>
  );
}

export default App;
