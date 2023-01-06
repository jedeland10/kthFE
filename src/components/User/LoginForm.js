import {NavLink} from "react-router-dom";
import React from "react";
import {useForm} from "react-hook-form";


function LoginForm({ user, submitText, submitAction }) {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: user || {},
    });

    return (
        <div>
            <form onSubmit={handleSubmit(submitAction)}>

                <div>
                    <label htmlFor={"username"}>Username</label>
                    <input type="text" {...register("username", { required: true})}
                    />
                    <span className="errors">
                    {errors.username && "Username is required"}
                    </span>
                </div>

                <div>
                    <label htmlFor={"password"}>Password</label>
                    <input type="password" {...register("password", { required: true})}
                    />
                    <span className="errors">
                    {errors.password && "Password"}
                    </span>
                </div>

                <div>
                    <button type="submit">{submitText}</button>
                </div>

                <div>
                    <NavLink to={'/register'}>Register</NavLink>
                </div>
            </form>
        </div>
    );
}

export default LoginForm
