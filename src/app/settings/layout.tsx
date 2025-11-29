import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | DevTunes",
    description: "Customize your DevTunes experience. Adjust audio settings, performance mode, and more.",
    robots: {
        index: false,
        follow: true,
    }
};

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
