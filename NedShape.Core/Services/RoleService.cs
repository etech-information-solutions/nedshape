﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using NedShape.Data.Models;
using NedShape.Core.Models;

namespace NedShape.Core.Services
{
    public class RoleService : BaseService<Role>, IDisposable
    {
        public RoleService()
        {
        }

        /// <summary>
        /// Gets a role using the specified id
        /// </summary>
        /// <param name="id">Id of the role to be fetched</param>
        /// <returns></returns>
        public override Role GetById( int id )
        {
            return context.Roles
                          .Include( "UserRoles" )
                          .Include( "UserRoles.User" )
                          .FirstOrDefault( c => c.Id == id );
        }

        /// <summary>
        /// Checks if a role with the specified unique reference already exists?
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public bool Exist( string name )
        {
            return context.Roles.Any( c => c.Name == name );
        }

        public string[] GetAllAspNetRoles()
        {
            return GetAllRoles().SelectMany( r => r.GetAspNetRoles() ).Distinct().ToArray();
        }

        private List<RoleModel> GetAllRoles()
        {
            List<RoleModel> model = new List<RoleModel>();

            List<Role> roles = context.Roles.ToList();

            foreach ( Role role in roles )
            {
                model.Add( new RoleModel() { Name = role.Name } );
            }

            return model;
        }
    }
}
