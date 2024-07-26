"use server"

import { OptionalUser } from "./types"
import { nanoid } from "nanoid"
import bcrypt from 'bcrypt'
import { addUser, getAllUsers, getUserByLogin, updateUserInDb } from "./api"
import { redirect } from "next/navigation"
import { createAuthSession, destroySession } from "./auth"

export const handleSignup = async (prev:unknown, data:FormData) => {
    if(!data.get('name') || !data.get('surname')){
        return  {
            message:"Please fill all the fields"
        }
    }

    const found = getUserByLogin(data.get('login') as string)
    if(found){
        return {
            message:"Login is busy!"
        }
    }

    const user:OptionalUser = {
        id:nanoid(),
        name:data.get('name') as string,
        surname:data.get('surname') as string,
        login:data.get('login') as string,
    }

    user.password = await bcrypt.hash(data.get('password') as string, 10)
    redirect("/login")

}

export const handleLogin = async (prev:unknown, data:FormData) => {
    if(!data.get('login') || !data.get('password')){
        return {
            message:"please fill all the fields"
        }
    }

    let login = data.get('login') as string
    let password = data.get('password') as string

    let user = getUserByLogin(login)
    
    if(!user){
        return {
            message:"Login is incorrect!"
        }
    }
    let match = await bcrypt.compare(password, user.password)
    if(!match){
        return {
            message:"password is wrong!!"
        }
    }
    await createAuthSession(user.id);
    redirect("/profile")
}

export const handleLogOut = async() => {
    await destroySession()
    redirect('/login');
}


export const handleChangeLogin = async (prev: unknown, data: FormData) => {
    if (!data.get('password') || !data.get('newlogin')) {
        return {
            message: "please fill all the fields"
        };
    }

    const newlogin = data.get('newlogin') as string;
    const password = data.get('password') as string;

    const foundUser = await findUserByPassword(password);

    if (!foundUser) {
        return {
            message: "Password is wrong!"
        };
    }

    const users = await getAllUsers();
    const userWithNewLogin = users.find((u) => u.login === newlogin);

    if (userWithNewLogin) {
        return {
            message: "The login is already taken!"
        };
    }

    const updatedUserInDb = updateUserInDb(foundUser);
    if(updatedUserInDb.changes) {
        await handleLogOut();
        return {
            message: "Login successfully changed!"
        };
    }
    return {
        message: "User not found!"
    };
}

async function findUserByPassword(password: string) {
    const users = await getAllUsers();
    const user = users.find(async (user) => await bcrypt.compare(password, user.password));
    return user;
}
