'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { useCommandPalette } from '@/lib/store'
import { Search, Home, Briefcase, Users, Calendar, Settings } from 'lucide-react'

export function CommandPalette() {
    const { isOpen, closeCommandPalette } = useCommandPalette()
    const [search, setSearch] = useState('')
    const router = useRouter()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                useCommandPalette.getState().toggleCommandPalette()
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    if (!isOpen) return null

    const navigate = (path: string) => {
        router.push(path)
        closeCommandPalette()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeCommandPalette}>
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <Command className="rounded-lg border border-white/10 bg-zinc-900 shadow-2xl">
                    <div className="flex items-center border-b border-white/10 px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Type a command or search..."
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Command.List className="max-h-[400px] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation" className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                            <CommandItem icon={<Home className="h-4 w-4" />} onSelect={() => navigate('/')}>
                                Home
                            </CommandItem>
                            <CommandItem icon={<Briefcase className="h-4 w-4" />} onSelect={() => navigate('/dashboard')}>
                                Dashboard
                            </CommandItem>
                            <CommandItem icon={<Users className="h-4 w-4" />} onSelect={() => navigate('/experts')}>
                                Find Experts
                            </CommandItem>
                            <CommandItem icon={<Calendar className="h-4 w-4" />} onSelect={() => navigate('/bookings')}>
                                My Bookings
                            </CommandItem>
                            <CommandItem icon={<Settings className="h-4 w-4" />} onSelect={() => navigate('/settings')}>
                                Settings
                            </CommandItem>
                        </Command.Group>

                        <Command.Group heading="Actions" className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                            <CommandItem icon={<Briefcase className="h-4 w-4" />} onSelect={() => navigate('/jobs/new')}>
                                Add New Job
                            </CommandItem>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    )
}

function CommandItem({ icon, children, onSelect }: { icon: React.ReactNode; children: React.ReactNode; onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-white/10 aria-selected:bg-white/10"
        >
            {icon}
            {children}
        </Command.Item>
    )
}
