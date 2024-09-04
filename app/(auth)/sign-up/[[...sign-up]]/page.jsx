import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-600 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt="AI Mock Interviewer Registration"
            src="/Login.png"  // Use the correct path
            fill
            className="absolute inset-0 object-cover opacity-80"
            loading="lazy"
          />
          <div className="hidden lg:block lg:p-12 relative z-10"> {/* Added z-index and relative position */}
    <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl"
      style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.7)' }}>
      Register to AI MOCK INTERVIEWER
    </h2>
    <p className="mt-4 leading-relaxed text-white"
      style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.7)' }}>
      Prepare for interviews LIKE NEVER BEFORE.
    </p>
  </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 bg-gray-600">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative block lg:hidden">
              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Register to AI MOCK INTERVIEWER
              </h1>
              <p className="mt-4 leading-relaxed text-gray-100 mb-10 text-justify">
                Prepare for interviews LIKE NEVER BEFORE.
              </p>
            </div>
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: " hover:bg-purple-600 border-none text-sm",
                },
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
}
