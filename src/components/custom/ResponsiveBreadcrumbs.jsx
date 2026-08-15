import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ResponsiveBreadcrumbs({ paths }) {
  if (!paths || paths.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center text-sm font-medium text-muted-foreground">
      {/* Desktop View */}
      <ol className="hidden md:flex items-center space-x-1">
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="text-foreground font-semibold">{path.label}</span>
              ) : (
                <>
                  <Link to={path.href} className="hover:text-foreground transition-colors">
                    {path.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1" />
                </>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile View */}
      <ol className="flex md:hidden items-center space-x-1">
        {paths.length <= 2 ? (
          paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            return (
              <li key={index} className="flex items-center">
                {isLast ? (
                  <span className="text-foreground font-semibold">{path.label}</span>
                ) : (
                  <>
                    <Link to={path.href} className="hover:text-foreground transition-colors">
                      {path.label}
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                  </>
                )}
              </li>
            );
          })
        ) : (
          <>
            <li className="flex items-center">
              <Link to={paths[0].href} className="hover:text-foreground transition-colors">
                {paths[0].label}
              </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
            </li>
            <li className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {paths.slice(1, -1).map((path, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link to={path.href}>{path.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ChevronRight className="w-4 h-4 mx-1" />
            </li>
            <li className="flex items-center">
              <span className="text-foreground font-semibold">{paths[paths.length - 1].label}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
