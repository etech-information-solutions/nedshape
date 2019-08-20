using System;
using System.Linq.Expressions;

namespace NedShape.Core.Specifications
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> GetExpression();
    }
}
