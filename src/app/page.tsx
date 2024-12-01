'use client';
import Header from "./components/Header";
import Footer from "./components/Footer";
import DynamicForm from "./components/form/DynamicForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <DynamicForm />
      </main>
      <Footer />
    </div>
  );
}
