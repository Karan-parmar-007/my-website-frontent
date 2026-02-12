import React from 'react'

/**
 * Skeleton loading component for cards and content sections
 * Uses CSS animation from index.css (.skeleton class)
 */

export const Skeleton = ({ className = '', ...props }) => (
  <div className={`skeleton ${className}`} {...props} />
)

export const CardSkeleton = () => (
  <div className="rounded-lg border border-[#172a45] bg-[#112240] p-6 space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-[#172a45]">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
)

export const FormSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
)

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-6">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <FormSkeleton />
  </div>
)

export default Skeleton
