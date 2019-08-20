using System;
using System.Collections.Generic;
using NedShape.Core.Enums;
using NedShape.Core.Interfaces;
using NedShape.Data.Models;

namespace NedShape.Core.Models
{
    public class UserModel : IUser
    {
        #region Properties

        public int Id { get; set; }

        public int Code { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime NiceCreatedOn { get; set; }

        public string Number { get; set; }

        public  string Message { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string JobTitle { get; set; }

        public string TaxNumber { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string IdNumber { get; set; }

        public bool IsSAId { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string Cell { get; set; }

        public Status Status { get; set; }

        public bool IsAdmin { get; set; }

        public BankDetailModel BankDetail { get; set; }

        public string LogoUrl { get; set; }

        public string BrochureUrl { get; set; }

        public string ContractUrl { get; set; }


        public Role Role { get; set; }

        public RoleType RoleType { get; set; }

        public RoleModel RoleModel { get; set; }

        public List<Role> Roles { get; set; }

        public List<Image> Images { get; set; }

        public List<Address> Addresses { get; set; }

        #endregion

        #region IUser Members

        public string Username
        {
            get
            {
                return this.Email;
            }
        }

        IRole IUser.Role
        {
            get
            {
                return this.RoleModel;
            }
        }

        public string[] GetAspNetRoles()
        {

            if ( this.RoleModel == null )
            {
                throw new Exception( "UserModel.Role must be populated in order to implement IUser" );
            }

            return ( RoleModel as IRole ).GetAspNetRoles();

        }

        #endregion
    }
}
