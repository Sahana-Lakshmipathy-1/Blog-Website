import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Newsletter = () => {
  return (
    <section className="bg-gray-50 py-10 px-6 rounded-xl shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Subscribe to our Newsletter</h2>
      <p className="text-gray-600 mb-4">
        Get the latest blog updates delivered to your inbox.
      </p>
      <form className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1"
        />
        <Button type="submit" className="w-full sm:w-auto">
          Subscribe
        </Button>
      </form>
    </section>
  )
}

export default Newsletter
