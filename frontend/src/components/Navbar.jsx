
import Switcher from "../Switcher"

const Navbar = () => {
    return (
        <div className="w-screen h-[5rem] flex dark:bg-gray-900 border-b-[1px]">
            <div className="flex-1 h-full flex items-center justify-start pl-8">
                <img className="h-3/4 w-auto dark:hidden" src="./img/black.png" alt="" />
                <img className="h-3/4 w-auto hidden dark:flex" src="./img/white.png" alt="" />
            </div>
            <div className="flex-1 h-full flex items-center justify-end pr-4">
                <Switcher />
            </div>
        </div>
    )
}

export default Navbar
