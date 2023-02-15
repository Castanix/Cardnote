import React, { ReactNode } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

/*
* Pagination component for CardSetList
* 
* setCount: the number of sets to be present in the list after applied filters
* pageNumber: current page of the list
* setPageNumber: state dispatch function for pageNumber
* configuration: configures the number of sets to be shown per page, default 4
*/
const CardSetListPagination = ({ setCount, pageNumber, setPageNumber, configuration = 4 }: { setCount: number, pageNumber: number, setPageNumber: React.Dispatch<React.SetStateAction<number>>, configuration?: number }) => {
	const maxPage = Math.ceil(setCount / configuration);

	
	// Set up pagination for list based on setCount
	const setPagination = () => {
		const paginationArr: ReactNode[] = [];

		for (let i = (pageNumber - 2); i <= (pageNumber + 2); i++) {
			if (i > 0 && i <= maxPage) {
				paginationArr.push(
					<PaginationItem 
						key={ i }
						title={`page ${i}`}
						active={ i === pageNumber }
						onClick={ () => setPageNumber(i) }
					>
						<PaginationLink onClick={ () => setPageNumber(i) }>
							{ i }
						</PaginationLink>
					</PaginationItem>
				);
			}
		}
		return paginationArr;
	};


	/* Rendered component */
	return (
		<Pagination>
			<PaginationItem title="first" disabled={ pageNumber === 1 }>
				<PaginationLink 
					first
					onClick={ () => setPageNumber(1) }
				/>
			</PaginationItem>

			<PaginationItem title="prev" disabled={ pageNumber === 1 }>
				<PaginationLink 
					previous
					onClick={ () => setPageNumber(pageNumber - 1) }
				/>
			</PaginationItem >

			{setPagination()}
			
			<PaginationItem title="next" disabled={ pageNumber === maxPage }>
				<PaginationLink 
					next
					onClick={ () => setPageNumber(pageNumber + 1) }
				/>
			</PaginationItem>

			<PaginationItem title="last" disabled={ pageNumber === maxPage }>
				<PaginationLink 
					last
					onClick={ () => setPageNumber(maxPage) }
				/>
			</PaginationItem>
		</Pagination>
	);
};

export default CardSetListPagination;