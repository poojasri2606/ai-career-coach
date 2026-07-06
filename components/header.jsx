import React from 'react'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ChevronDown, LayoutDashboard, StarsIcon, FileText, GraduationCap, PenBox } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { checkUser } from '@/lib/checkUser';


const Header = async () => {
  await checkUser();
  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href="/">
          <Image src="/logo.jpg" alt="ai-career-coach" width={200} height={60} className="h-12 py-1 w-auto object-contain" />
        </Link>

        <div className='flex items-center space-x-2 md:space-x-4'>
          <Show when="signed-in">
            <Link href={"/dashboard"}>
              <Button variant='outline'>
                <LayoutDashboard className='h-4 w-4' /> <span className='hidden md:block cursor-pointer'>Industry Insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
>
  <StarsIcon className="h-4 w-4" />
  <span className="hidden md:block">Growth Tools</span>
  <ChevronDown className="h-4 w-4" />
</DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href={"/resume"} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/ai-cover-letter"}
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/interview"} className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu></Show>
          <Show when="signed-out">
            <SignInButton>
              <Button variant='outline' className={"cursor-pointer"}>Sign In</Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </Show>
        </div>
      </nav>


    </header>
  )
}
export default Header