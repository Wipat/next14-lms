import Navbar from "./_components/navbar"
import Sidebar from "./_components/sidebar"

const LayoutDashboard = ({
    children
} : {
    children : React.ReactNode
}) => {
  return (
    <div className="h-full">
      <div className="h-[87px] fixed md:pl-60 border-b w-full shadow-sm z-50">
        <Navbar/>
      </div>
      <div className="fixed z-50 h-full w-60 hidden md:flex flex-col border-r shadow-sm">
        <Sidebar/>
      </div>
      <main className="md:pl-60 pt-[87px] h-full">
        {children}
      </main>
    </div>
  )
}

export default LayoutDashboard