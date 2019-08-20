using System;
using System.Collections.Generic;
using System.Linq;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class BankDetailService : BaseService<BankDetail>, IDisposable
    {
        public BankDetailService()
        {

        }

        /// <summary>
        /// Gets a list of banks using the specified userid
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<BankDetail> ListByUserId( int userId )
        {
            return context.BankDetails.Where( b => b.UserId == userId ).ToList();
        }

        /// <summary>
        /// Gets a list of banks using the specified account type
        /// </summary>
        /// <param name="accountType"></param>
        /// <returns></returns>
        public List<BankDetail> ListByAccountType( int accountType )
        {
            return context.BankDetails.Where( b => b.AccountType == accountType ).ToList();
        }

        /// <summary>
        /// Gets a Bank Detail using the specified user id
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public BankDetail GetByUserId( int userId )
        {
            return context.BankDetails.Include( "Bank" ).FirstOrDefault( b => b.UserId == userId );
        }
    }
}
