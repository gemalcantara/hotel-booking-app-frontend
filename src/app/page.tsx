import Image from "next/image";
import { BookingProvider } from "../context/BookingContext";
import BookingForm from "../components/BookingForm";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full flex flex-col items-center py-4">
        <Image
          className="dark:invert mb-4"
          src="/next.svg"
          alt="Next.js logo"
          width={150}
          height={30}
          priority
        />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Hotel Booking System</h1>
      </header>
      
      <main className="w-full max-w-4xl mx-auto">
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </main>
      
      <footer className="w-full flex gap-[24px] flex-wrap items-center justify-center pt-8">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          About Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Rooms & Suites
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Contact →
        </a>
      </footer>
    </div>
  );
}
