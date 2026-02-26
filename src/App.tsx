import { Route, Switch, Router, Link, useLocation } from 'wouter';
import { KoalaProvider } from './context/KoalaContext';
import Home from './pages/Home';
import KinshipCalculator from './pages/Kinship';

const NotFound = () => <div className="p-10 text-center text-gray-400 font-medium">404 Not Found</div>;

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="mb-5 shrink-0 px-5">
      <div className="bg-gray-200/60 p-1 rounded-xl grid grid-cols-2 gap-1 shadow-inner relative border border-white/20">
        <Link href="/">
          <a className={`flex items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-sm font-bold rounded-lg transition-all leading-none ${location === '/' ? 'bg-white text-koala-dark shadow-sm' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100/50'}`}>
            <span className="text-base sm:text-lg">🌿</span>
            <span>ファミリーツリー</span>
          </a>
        </Link>
        <Link href="/calculator">
          <a className={`flex items-center justify-center gap-1.5 py-2.5 text-[11px] sm:text-sm font-bold rounded-lg transition-all leading-none ${location === '/calculator' ? 'bg-white text-koala-dark shadow-sm' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100/50'}`}>
            <span className="text-base sm:text-lg">🔍</span>
            <span>つながりチェック</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header className="pt-10 pb-4 px-6 text-center shrink-0">
      <h1 className="text-2xl font-bold text-koala-dark flex justify-center items-center gap-2">
        <span className="text-3xl">🐨</span> Koala Family Tree
      </h1>
      <p className="text-xs text-gray-500 mt-2 font-medium">国内コアラのいのちの繋がり</p>
    </header>
  );
}

function App() {
  return (
    <KoalaProvider>
      <Router base="/koala-memo-family-tree">
        <div className="min-h-screen bg-koala-light text-koala-text font-sans selection:bg-koala-base/30">
          <div className="max-w-md mx-auto min-h-screen relative shadow-sm flex flex-col bg-koala-light">
            <Header />
            <Navigation />
            <main className="flex-1 flex flex-col overflow-hidden">
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
