import type { Request, Response } from "express"

import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { generateJWT } from "../utils/jwt"


export class AuthController {

    static createAccount = async (req : Request, res : Response) => {
        try {
            const {password, email} = req.body

            // Prevenir duplicados
            const userExists = await User.findOne({email})

            if(userExists) {
                const error = new Error('Correo electronico ya esta asociado a una cuenta.')
                return res.status(409).json({error: error.message})
            }

            //Hash Password
            req.body.password = await hashPassword(password)

            //Crear usuario
            const user = new User(req.body)

            //Generar Token
            const token = new Token()

            token.token = generateToken()

            token.user = user._id

            await Promise.allSettled([ user.save(), token.save() ])

            res.send('Cuenta creada, revisa tu email para confirmarla')
        }catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static confirmAccount = async (req : Request, res : Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)

            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]) 

            return res.send('Cuenta confirmada exitosamente')
        }
        catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static login = async (req : Request, res : Response) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({email})

            if(!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({error: error.message})
            }
            
            if(!user.confirmed) {
                const token = new Token()
                const tokenExists = await Token.findOne({user: user._id})
                if(tokenExists) {
                    const error = new Error('Cuenta no ha sido confirmada, confirmala con el codigo que se te ha enviado por correo')
                    return res.status(401).json({error: error.message})
                }

                token.user = user._id
                token.token = generateToken()

                await token.save()

                const error = new Error('Cuenta no ha sido confirmada, se ha enviado un email de confirmación')
                return res.status(401).json({error: error.message})
                
            }

            //Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta.')
                return res.status(401).json({error: error.message})
            }
            const jwt_token = generateJWT({id: user._id})
            return res.send(jwt_token)
            //return res.send(`Inicio de sesion exitoso, Bienvenido ${user.name}`)
        }
        catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static requestConfirmationCode = async (req : Request, res : Response) => {
        try {
            const { email} = req.body

            // Usuario Existe
            const user = await User.findOne({email})

            if(!user) {
                const error = new Error('Usuario no registrado.')
                return res.status(404).json({error: error.message})
            }

            const hasUserActiveToken = await Token.findOne({user: user._id})

            if(hasUserActiveToken){
                const error = new Error('Usuario tiene token activo de confirmacion. Revise su Correo Electronico') 
                return res.status(403).json({error: error.message})
            }

            if(user.confirmed){
                const error = new Error('Usuario ya ha sido confirmado') 
                return res.status(403).json({error: error.message})
            }

            //Generar Token
            const token = new Token()

            token.token = generateToken()

            token.user = user._id

            await  token.save()

            res.send('Se envio un nuevo token a tu email')
        }catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static forgotPassword = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            // Usuario Existe
            const user = await User.findOne({email})

            if(!user) {
                const error = new Error('Usuario no registrado.')
                return res.status(404).json({error: error.message})
            }

            //Generar Token
            const token = new Token()

            token.token = generateToken()

            token.user = user._id

            await token.save()

            res.send('Revisa tu email para instrucciones')
        }catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static validateToken = async (req : Request, res : Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }

            return res.send('Token Valido,Ingresa tu nuevo Password')
        }
        catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static updatePasswordWithToken = async (req : Request, res : Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error('Token no valido')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)

            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            return res.send('Password modificado correctamente')
        }
        catch(error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error)
        }
    }

    static user = async (req : Request, res : Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req : Request, res : Response) => {
        const {name, email} = req.body

        req.user.name = name
        req.user.email = email

        const userExists = await User.findOne({email})

        if (userExists && userExists._id.toString() !== req.user._id.toString()) {
            const error = new Error('Email ya esta registrado')
            return res.status(409).json({error: error.message})
        }

        try {
            await req.user.save()
            res.send('Perfil Actualizado Correctamente')
        }catch(error){
            return res.status(500).send('Hubo un error')
        }
    }

    static updateCurrentUserPassword = async (req : Request, res : Response) => {
        const {current_password, password, password_confirmation} = req.body

        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)

        if(!isPasswordCorrect) {
            const error = new Error('Contraseña introducida no coincide con la actual.')
            return res.status(401).json({error: error.message})
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Contraseña Actualizada Correctamente.')
        }catch(error){
            res.status(500).send('Hubo un Error')
        }
        
        
    }

    static checkPassword = async (req : Request, res : Response) => {
        const {password} = req.body

        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await checkPassword(password, user.password)

        if(!isPasswordCorrect) {
            const error = new Error('Contraseña introducida no coincide con la actual.')
            return res.status(401).json({error: error.message})
        }

        res.send('Password Correcto')
    }
}