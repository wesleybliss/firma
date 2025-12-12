import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from 'firebase/auth'
import { LogOut, LogIn, Settings } from 'lucide-react'

const UserAccountMenu = ({
    user,
    handleSignOut,
    handleSignIn,
}: {
    user: User | null
    handleSignOut: () => void
    handleSignIn: () => void
}) => {
    return user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 hover:bg-slate-100
                        dark:hover:bg-slate-700 data-[state=open]:bg-slate-100
                        dark:data-[state=open]:bg-slate-700">
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="size-6 rounded-full" />
                    ) : (
                        <div className="size-6 rounded-full bg-slate-200" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 dark:bg-slate-900">
                <DropdownMenuLabel>
                    <h5 className="text-base font-semibold">{user.displayName || 'Anonymous'}</h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer w-full flex items-center">
                        <Settings className="mr-2 size-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 size-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button variant="outline" size="sm" onClick={handleSignIn}>
            <LogIn className="size-4" />
            Sign in with Google
        </Button>
    )
}

export default UserAccountMenu
