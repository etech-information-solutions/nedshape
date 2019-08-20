using System;
using System.Linq;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class BankService : BaseService<Bank>, IDisposable
    {
        public BankService()
        {

        }

        /// <summary>
        /// Checks if a bank with the same name already exists...?
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public bool Exist( string name )
        {
            return context.Banks.Any( b => b.Name.ToLower() == name.ToLower() );
        }
    }
}
