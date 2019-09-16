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
        /// Gets a list of banks using the specified account type
        /// </summary>
        /// <param name="accountType"></param>
        /// <returns></returns>
        public List<BankDetail> ListByAccountType( int accountType )
        {
            return context.BankDetails.Where( b => b.AccountType == accountType ).ToList();
        }

        /// <summary>
        /// Gets a list of BankDetails using the specified objectId and objectType
        /// </summary>
        /// <param name="objectId"></param>
        /// <param name="objectType"></param>
        /// <returns></returns>
        public List<BankDetail> List( int objectId, string objectType )
        {
            return context.BankDetails.Where( b => b.ObjectId == objectId && b.ObjectType == objectType ).ToList();
        }
    }
}
