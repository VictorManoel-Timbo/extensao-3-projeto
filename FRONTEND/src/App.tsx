import { Button } from "./components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import * as React from "react"

function App() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())


  return (
    <>
      <h1 className="text-6xl text-foodguard-600">FoodGuard</h1>
      <Button variant="outline" className="bg-red-500">Button</Button>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border-2"
      />
    </>
  )
}

export default App
