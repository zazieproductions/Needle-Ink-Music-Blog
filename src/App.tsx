import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AppProvider, useApp } from './components/store';
import Home from './pages/Home';
import ReviewsIndex from './pages/ReviewsIndex';
import ReviewDetail from './pages/ReviewDetail';
import BNM from './pages/BNM';
import Charts from './pages/Charts';
import { GenresIndex, GenreDetail } from './pages/Genres';
import { WritersIndex, WriterDetail } from './pages/Writers';
import { NewsIndex, NewsDetail, FeaturesIndex, FeatureDetail } from './pages/NewsFeatures';
import { SearchPage, ReadingList, ListsPage } from './pages/Misc';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Shell() {
  const { saved } = useApp();
  return (
    <div className="paper-grain min-h-screen">
      <ScrollTop />
      <Header savedCount={saved.length} />
      <main className="pb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<ReviewsIndex />} />
          <Route path="/reviews/:slug" element={<ReviewDetail />} />
          <Route path="/best-new-music" element={<BNM />} />
          <Route path="/news" element={<NewsIndex />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/features" element={<FeaturesIndex />} />
          <Route path="/features/:slug" element={<FeatureDetail />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/genres" element={<GenresIndex />} />
          <Route path="/genres/:name" element={<GenreDetail />} />
          <Route path="/writers" element={<WritersIndex />} />
          <Route path="/writers/:id" element={<WriterDetail />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reading-list" element={<ReadingList />} />
          <Route path="*" element={
            <div className="mx-auto max-w-3xl px-4 py-20 text-center">
              <div className="font-mono2 text-[11px] font-bold tracking-[0.3em] uppercase">Error 404</div>
              <div className="font-display mt-2 text-5xl font-black">Lost in the stacks</div>
              <p className="mt-3 text-[var(--color-smoke)]">That page doesn't exist. Try the front page instead.</p>
              <Link to="/" className="font-mono2 mt-6 inline-block border-2 border-black px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">Front page</Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Shell />
      </AppProvider>
    </HashRouter>
  );
}
