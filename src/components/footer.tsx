import Link from "next/link"

export function Footer() {
    const links = [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "FAQ", href: "/faq" },
        { name: "Changelog", href: "/changelog" },
        { name: "Refer & Earn", href: "/refer" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <footer className="w-full py-6 mt-12 border-t bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="hover:text-primary transition-colors hover:underline underline-offset-4"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </footer>
    )
}
