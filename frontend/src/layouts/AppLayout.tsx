import { Link, Outlet, Navigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import NavMenu from '@/components/NavMenu'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/Logo'
import { SocketProvider } from '../context/SocketProvider'
import { useEffect } from 'react'

export default function AppLayout() {

    const {data, isError, isLoading} = useAuth()

    useEffect(() => {
        if (localStorage.getItem('show_welcome') && data) {
            toast.success(`Bienvenido, ${data.name}`)
            localStorage.removeItem('show_welcome')
        }
    }, [data])

    if(isLoading) return 'Cargando..'

    if(isError) {
        return <Navigate to='/auth/login'/>
    }

    if(data)
    return (
        <SocketProvider>
            <header className='bg-slate-00 py-5'>
                <div className='max-w-10/12 mx-auto flex flex-col lg:flex-row justify-between items-end'>
                    <div className='w-48'>
                        <Link to={'/'}>
                            <Logo/>
                        </Link>
                    </div>
                    <div className='flex gap-2'>
                        <NavMenu name={data.name}/>
                    </div>
                </div>
            </header>
            <section className='max-w-10/12 mx-auto mt-10 p-5'>
                <Outlet/>
            </section>
            <footer className='py-5'>
                <p className='text-center'>{new Date().getFullYear()}</p>
            </footer>
        </SocketProvider>
    )
}
