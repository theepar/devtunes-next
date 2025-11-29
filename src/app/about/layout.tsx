import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About DevTunes - The Team & Mission",
    description: "Meet the team behind DevTunes and learn about our mission to help developers focus. Built by developers, for developers.",
    openGraph: {
        title: "About DevTunes - The Team & Mission",
        description: "Meet the team behind DevTunes and learn about our mission to help developers focus.",
        url: "https://devtunes.vercel.app/about",
    },
    alternates: {
        canonical: "/about",
    }
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
