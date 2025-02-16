import {Link} from "@heroui/link";

import {Navbar} from "@/components/navbar";
import React from "react";

export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen">
            <Navbar/>
            <main className="container mx-auto max-w-7xl px-6 flex-grow">
                {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
                <Link
                    isExternal
                    className="flex items-center gap-1 text-current"
                    href="https://github.com/nicocha30/ligolo-ng"
                    title="Ligolo-ng homepage"
                >
                    <span className="text-default-600">Ligolo-ng WebUI -</span>
                    <p className="text-warning">Nicocha30 & L'Ami du Raisin</p>
                </Link>
            </footer>
        </div>
    );
}
